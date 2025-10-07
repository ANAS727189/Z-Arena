#!/usr/bin/env python3
"""
Scan challenge files for external dependencies that might cause issues in Judge0
"""

import json
import os
import re
from pathlib import Path

# External dependencies that cause issues
PROBLEMATIC_IMPORTS = {
    'python': [
        'aiohttp', 'requests', 'flask', 'django', 'fastapi', 'numpy', 'pandas', 
        'tensorflow', 'torch', 'sklearn', 'matplotlib', 'seaborn', 'opencv',
        'pillow', 'pil', 'beautifulsoup', 'scrapy', 'selenium'
    ],
    'javascript': [
        'axios', 'express', 'lodash', 'moment', 'react', 'vue', 'angular',
        'jquery', 'webpack', 'babel', 'typescript'
    ],
    'go': [
        'github.com', 'golang.org/x', 'google.golang.org', 'go.uber.org'
    ],
    'java': [
        'spring', 'hibernate', 'jackson', 'gson', 'apache.commons',
        'junit', 'mockito', 'slf4j'
    ]
}

def scan_code_for_dependencies(code: str, language: str) -> list:
    """Scan code for problematic dependencies"""
    issues = []
    
    if language not in PROBLEMATIC_IMPORTS:
        return issues
    
    problematic = PROBLEMATIC_IMPORTS[language]
    
    # Check imports/requires
    for dep in problematic:
        patterns = []
        
        if language == 'python':
            patterns = [
                rf'import\s+{re.escape(dep)}',
                rf'from\s+{re.escape(dep)}',
                rf'import\s+\w*{re.escape(dep)}\w*',
                rf'from\s+\w*{re.escape(dep)}\w*'
            ]
        elif language == 'javascript':
            patterns = [
                rf'require\s*\(\s*[\'\"]{re.escape(dep)}[\'\"]',
                rf'import\s+.*from\s+[\'\"]{re.escape(dep)}[\'\"]',
                rf'import\s+[\'\"]{re.escape(dep)}[\'\"]'
            ]
        elif language == 'go':
            patterns = [
                rf'import\s+[\'\"]{re.escape(dep)}',
                rf'"{re.escape(dep)}'
            ]
        elif language == 'java':
            patterns = [
                rf'import\s+.*{re.escape(dep)}',
                rf'@{re.escape(dep)}'
            ]
        
        for pattern in patterns:
            if re.search(pattern, code, re.IGNORECASE | re.MULTILINE):
                issues.append(f"Found dependency: {dep}")
    
    return issues

def scan_challenge_file(filepath: Path) -> dict:
    """Scan a single challenge file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            challenge = json.load(f)
        
        result = {
            'file': filepath.name,
            'id': challenge.get('id', 'unknown'),
            'title': challenge.get('metadata', {}).get('title', 'Unknown'),
            'languages': [],
            'issues': []
        }
        
        # Check each language
        languages = challenge.get('languages', {})
        for lang, lang_data in languages.items():
            lang_info = {'language': lang, 'issues': []}
            
            # Check starter code
            starter_code = lang_data.get('starterCode', '')
            if starter_code:
                issues = scan_code_for_dependencies(starter_code, lang)
                if issues:
                    lang_info['issues'].extend([f"Starter: {issue}" for issue in issues])
            
            # Check solution code
            solution_code = lang_data.get('solutionCode', '')
            if solution_code:
                issues = scan_code_for_dependencies(solution_code, lang)
                if issues:
                    lang_info['issues'].extend([f"Solution: {issue}" for issue in issues])
            
            if lang_info['issues']:
                result['languages'].append(lang_info)
                result['issues'].extend(lang_info['issues'])
        
        return result
        
    except Exception as e:
        return {
            'file': filepath.name,
            'error': str(e),
            'issues': [f"Error reading file: {e}"]
        }

def main():
    challenges_dir = Path('/mnt/MasterDrive/Z-Studio-appwrite/Z-challenger/challenges')
    
    if not challenges_dir.exists():
        print(f"Challenges directory not found: {challenges_dir}")
        return
    
    problematic_challenges = []
    
    # Scan all challenge files
    for filepath in challenges_dir.glob('challenge-*.json'):
        # Skip Z-- challenges as requested
        if 'challenge-z-' in filepath.name:
            continue
            
        result = scan_challenge_file(filepath)
        
        if result['issues']:
            problematic_challenges.append(result)
    
    # Report results
    print(f"Scanned {len(list(challenges_dir.glob('challenge-*.json')))} challenge files")
    print(f"Found {len(problematic_challenges)} challenges with potential issues:")
    print("=" * 80)
    
    for challenge in problematic_challenges:
        print(f"\n📄 {challenge['file']}")
        print(f"   ID: {challenge.get('id', 'unknown')}")
        print(f"   Title: {challenge.get('title', 'Unknown')}")
        
        if 'error' in challenge:
            print(f"   ❌ Error: {challenge['error']}")
        else:
            for lang_info in challenge['languages']:
                print(f"   🔍 {lang_info['language'].upper()}:")
                for issue in lang_info['issues']:
                    print(f"      - {issue}")
    
    print(f"\n📊 Summary: {len(problematic_challenges)} challenges need replacement")

if __name__ == '__main__':
    main()