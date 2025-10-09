import { Code2, Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: 'https://github.com/ANAS727189/Z-Arena', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' }, // Replace '#' with your Twitter link
    { icon: Mail, href: 'mailto:support@example.com', label: 'Contact' },
  ];

  const linkSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Challenges', href: '/challenges' },
        { label: 'Leaderboard', href: '/leaderboard' },
        { label: 'Wars (PvP)', href: '/compete-wars' },
        { label: 'Achievements', href: '/achievements' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Z-- Language', href: '#' }, // Link to Z-- docs
        { label: 'Documentation', href: '#' }, // Link to your docs
        { label: 'Contributing', href: '#' }, // Link to CONTRIBUTING.md
        { label: 'Judge0 API', href: 'https://judge0.com/', external: true },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'License (MIT)', href: '#' },
        { label: 'FAQ', href: '/#faq' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand and Socials */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-teal-400">
                <Code2 className="h-6 w-6 text-black" />
              </div>
              <h1 className="font-heading text-xl font-bold">Z-Arena</h1>
            </div>
            <p className="text-gray-400 text-sm max-w-xs mb-6">
              The ultimate open-source competitive programming platform. Code, Compete, Conquer.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2, 3, 4: Link Sections */}
          {linkSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Z-Arena. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">Made for the coding community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;