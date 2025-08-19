import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Github, Linkedin, Mail, ExternalLink, Code, Palette, Zap, Sun, Moon, Download } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Portfolio.css';
import profileImg from '../assets/profile.jpg';

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const cursorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    // GSAP loading animation
    gsap.to('.loading-spinner', {
      rotation: 360,
      duration: 1,
      repeat: -1,
      ease: 'none'
    });

    gsap.to('.loading-text', {
      opacity: 0.5,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    });

    // Simulated loading
    const timer = setTimeout(() => {
      gsap.to('.loading-screen', {
        opacity: 0,
        duration: 0.5,
        onComplete: () => setIsLoading(false)
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // GSAP animations
    gsap.fromTo('.animate-fade-in-up', 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        stagger: 0.2,
        ease: 'power2.out'
      }
    );

    // Scroll animations for sections
    const sections = [aboutRef, skillsRef, projectsRef, contactRef];
    sections.forEach((ref, index) => {
      if (ref.current) {
        gsap.fromTo(ref.current,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });

    // Active section detection
    const animateOnScroll = () => {
      const sections = [
        { ref: heroRef, name: 'hero' },
        { ref: aboutRef, name: 'about' },
        { ref: skillsRef, name: 'skills' },
        { ref: projectsRef, name: 'projects' },
        { ref: contactRef, name: 'contact' }
      ];

      sections.forEach(({ ref, name }) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
            setActiveSection(name);
          }
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    return () => {
      window.removeEventListener('scroll', animateOnScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoading]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // CV Download Function
  const downloadCV = () => {
    // Method 1: Direct Google Drive download (requires public access)
    // Convert your Google Drive link to direct download format
    const fileId = '16zYBDGfjnBkcjpXO73vvgt4fVPDIqR3_';
    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = directDownloadUrl;
    link.download = 'Ashish_Rathod_CV.pdf'; // Specify the filename
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Alternative method if you want to open in new tab first
  const openCV = () => {
    const driveUrl = 'https://drive.google.com/file/d/16zYBDGfjnBkcjpXO73vvgt4fVPDIqR3_/view';
    window.open(driveUrl, '_blank');
  };

  // Apply theme to document body
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="loading-screen fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="loading-spinner w-16 h-16 border-t-4 border-cyan-400 border-solid rounded-full mb-4"></div>
          <div className="loading-text text-white text-xl font-light tracking-widest">
            Loading Portfolio...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className="custom-cursor"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo">
              Portfolio
            </div>
            <div className="nav-links">
              {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(
                    item === 'About' ? aboutRef :
                    item === 'Skills' ? skillsRef :
                    item === 'Projects' ? projectsRef : contactRef
                  )}
                  className={activeSection === item.toLowerCase() ? 'active' : ''}
                >
                  {item}
                </button>
              ))}
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="hero">
        {/* Animated Background */}
        <div className="hero-background">
          <div className="hero-gradient"></div>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <h1 className="hero-title">
              Ashish Rathod
            </h1>
            <p className="hero-subtitle">
              Full Stack Developer & Information Technology Student
            </p>
          </div>
          
          <div className="social-links animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <a href="https://github.com/ashishrathod9" target="_blank" rel="noopener noreferrer" className="social-link">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/ashish-rathod-519b54316/" target="_blank" rel="noopener noreferrer" className="social-link">
              <Linkedin size={24} />
            </a>
            <a href="mailto:ashishrathod53839@gmail.com" className="social-link">
              <Mail size={24} />
            </a>
          </div>

          <button
            onClick={() => scrollToSection(aboutRef)}
            className="scroll-down"
          >
            <ChevronDown size={32} color="#06b6d4" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              About Me
            </h2>
            <div className="section-divider"></div>
          </div>

          <div className="about-grid">
            <div className="about-text">
              <p>
                I'm a passionate Information Technology student at Dharmsinh Desai University with a 
                strong foundation in full-stack development. I specialize in modern web technologies 
                and love creating innovative solutions that solve real-world problems.
              </p>
              <p>
                With a current CPI of 7.53/10.00, I'm constantly learning and exploring new technologies. 
                I've participated in hackathons and developed several full-stack projects using MERN stack, 
                React.js, and Spring Boot.
              </p>
              <button 
                onClick={downloadCV} 
                className="download-btn"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Download size={18} />
                Download CV
              </button>
            </div>
            <div className="about-visual">
              <div className="visual-outer">
                <img
                  src={profileImg}
                  alt="Ashish Rathod"
                  className="profile-photo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="section skills-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Skills
            </h2>
            <div className="section-divider"></div>
          </div>

          <div className="skills-grid">
            {[
              { icon: Code, title: 'Programming Languages', skills: ['C', 'C++', 'Java', 'JavaScript'] },
              { icon: Zap, title: 'Web Technologies', skills: ['HTML', 'CSS', 'React.js', 'Tailwind CSS'] },
              { icon: Palette, title: 'Backend & Database', skills: ['Spring Boot', 'Node.js', 'MySQL', 'MongoDB', '.NET'] }
            ].map((category, index) => (
              <div key={index} className="skill-card">
                <div className="skill-icon">
                  <category.icon size={32} color="#000" />
                </div>
                <h3 className="skill-title">{category.title}</h3>
                <ul className="skill-list">
                  {category.skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="skill-item">
                      <div className="skill-bullet"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Projects
            </h2>
            <div className="section-divider"></div>
          </div>

          <div className="projects-grid">
            {[
              { 
                title: 'SSCOverflow', 
                desc: 'Student-focused Q&A platform inspired by Stack Overflow with question posting, voting, badge system, and real-time chat', 
                tech: ['.NET Core', 'React.js'],
                github: 'https://github.com/ashishrathod9/SSCOverflow',
                live: null
              },
              { 
                title: 'ConnectUs', 
                desc: 'Service marketplace platform connecting customers with local service providers for home services', 
                tech: ['MERN Stack', 'Tailwind CSS'],
                github: 'https://github.com/ashishrathod9/ConnectUs',
                live: 'https://connect-us-xi.vercel.app/'
              },
              { 
                title: 'CampusWeb Builder', 
                desc: 'Dynamic website builder for educational institutions with student portals and course management', 
                tech: ['MERN Stack', 'Tailwind CSS'],
                github: 'https://github.com/ashishrathod9/CampusWeb-Builder',
                live: 'https://websitecreator-navy.vercel.app/'
              },
              { 
                title: 'Project-Pilot', 
                desc: 'Streamlined project management platform with team management, issue tracking, and commenting features', 
                tech: ['React.js', 'shadcn.ui', 'Spring Boot'],
                github: 'https://github.com/ashishrathod9/Project-Pilot',
                live: null
              },
              { 
                title: 'VidBot', 
                desc: 'AI-powered platform generating animated 3D math videos based on user prompts (DUHacks 4.0 Top 5 Finalist)', 
                tech: ['AI', '3D Animation', 'Mathematics'],
                github: 'https://github.com/ashishrathod9/VidBot',
                live: null
              },
              { 
                title: 'Crop Detection Website', 
                desc: 'Agriculture-themed project detecting suitable crops based on soil conditions (DA-IICT Hackathon 2024)', 
                tech: ['Agriculture', 'Machine Learning', 'Web Development'],
                github: 'https://github.com/ashishrathod9/Crop-Recommendation-System',
                live: null
              }
            ].map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-image">
                  <Code size={64} color="#06b6d4" />
                </div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tech">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                    <Github size={16} />
                    <span>Code</span>
                  </a>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link">
                      <ExternalLink size={16} />
                      <span>Live</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="section contact-section">
        <div className="contact-container">
          <h2 className="section-title">
            Let's Connect
          </h2>
          <div className="section-divider"></div>
          <p className="contact-text">
            Ready to bring your next project to life? Let's create something amazing together.
          </p>
          
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">
                <Mail size={32} color="#000" />
              </div>
              <div>
                <h3 className="contact-title">Email</h3>
                <p className="contact-value">ashishrathod53839@gmail.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <Linkedin size={32} color="#000" />
              </div>
              <div>
                <h3 className="contact-title">LinkedIn</h3>
                <p className="contact-value">linkedin.com/in/ashish-rathod-519b54316</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <Github size={32} color="#000" />
              </div>
              <div>
                <h3 className="contact-title">GitHub</h3>
                <p className="contact-value">github.com/ashishrathod9</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <Code size={32} color="#000" />
              </div>
              <div>
                <h3 className="contact-title">LeetCode</h3>
                <p className="contact-value">leetcode.com/your-profile</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <Zap size={32} color="#000" />
              </div>
              <div>
                <h3 className="contact-title">Phone</h3>
                <p className="contact-value">+91 6353334263</p>
              </div>
            </div>
          </div>

          <button className="contact-btn">
            Get In Touch
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <p className="footer-text">© 2025 Ashish Rathod. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
