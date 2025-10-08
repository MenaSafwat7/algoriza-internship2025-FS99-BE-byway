import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    getHelp: [
      { name: 'Contact Us', href: '#' },
      { name: 'Latest Articles', href: '#' },
      { name: 'FAQ', href: '#' }
    ],
    programs: [
      { name: 'Art & Design', href: '/courses?category=1' },
      { name: 'Business', href: '/courses?category=2' },
      { name: 'IT & Software', href: '/courses?category=3' },
      { name: 'Languages', href: '/courses?category=4' },
      { name: 'Programming', href: '/courses?category=5' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full"></div>
              <span className="text-xl font-bold text-white">Byway</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Empowering learners worldwide with high-quality, accessible education.
              Join thousands of students advancing their careers through our expert-led courses.
            </p>
            <p className="text-gray-400 text-xs">
              © {currentYear} Byway. All rights reserved.
            </p>
          </div>

          {}
          <div className="md:col-span-1">
            <div className="grid grid-cols-2 gap-8">
              {}
              <div>
                <h3 className="text-white font-semibold mb-4">Get Help</h3>
                <ul className="space-y-2">
                  {footerLinks.getHelp.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {}
              <div>
                <h3 className="text-white font-semibold mb-4">Programs</h3>
                <ul className="space-y-2">
                  {footerLinks.programs.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                <span>123 Education St, Learning City, LC 12345</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="h-4 w-4 mr-3 text-gray-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="h-4 w-4 mr-3 text-gray-400" />
                <span>support@byway.com</span>
              </div>
            </div>

            {}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
