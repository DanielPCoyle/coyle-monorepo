import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.logoContainer}>
          <h2 style={styles.logoText}>Philadelphia Screen Printing</h2>
        </div>

        <div style={styles.linksContainer}>
          <a href="/terms" style={styles.link}>Terms & Conditions</a>
          <a href="/privacy" style={styles.link}>Privacy Policy</a>
        </div>

        <div style={styles.socialContainer}>
          <a href="https://twitter.com/yourtwitter" target="_blank" rel="noopener noreferrer" style={styles.icon}>
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://facebook.com/yourfacebook" target="_blank" rel="noopener noreferrer" style={styles.icon}>
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://instagram.com/yourinstagram" target="_blank" rel="noopener noreferrer" style={styles.icon}>
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>

        <div style={styles.copyright}>
          &copy; {currentYear} Philadelphia Screen Printing. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px 0',
    textAlign: 'center',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: '10px',
  },
  logoText: {
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  linksContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '10px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.9em',
  },
  socialContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '10px',
  },
  icon: {
    color: '#fff',
    fontSize: '1.2em',
  },
  copyright: {
    fontSize: '0.8em',
  },
};

export default Footer;
