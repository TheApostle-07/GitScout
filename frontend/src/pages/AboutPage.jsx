import React from "react";
import "../styles/About.css"; // External styling

const AboutPage = () => {
  return (
    <div className="about-section">
      {/* About Section */}
      <h1 className="about-title">About GitScout</h1>
      <p className="about-description">
        GitScout is your go-to companion for analyzing GitHub profiles, providing
        advanced AI-based insights, and offering data-driven recruiting tools.
        Whether you’re a recruiter or a student, GitScout equips you with the
        resources to stay informed and optimize your GitHub presence.
      </p>

      {/* Social Links Section */}
      <section className="social-links">
        <h3>Connect with Us</h3>
        <div className="social-icons">
          <a
            href="https://github.com/TheApostle-07"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <i className="devicon-github-plain"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/rufus-bright-77399a1a3/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <i className="devicon-linkedin-plain"></i>
          </a>
          <a
            href="https://x.com/bright_ruf93341"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <i className="devicon-twitter-original"></i>
          </a>
        </div>
      </section>

      {/* Technologies & Skills Section */}
      <section className="skills">
        <h3>Technologies & Skills</h3>
        <div className="tech-logos">
          {[
            // Frontend
            { icon: "devicon-react-original", name: "React" },
            { icon: "devicon-javascript-plain", name: "JavaScript" },
            { icon: "devicon-tailwindcss-plain", name: "Tailwind CSS" },
            // Backend
            { icon: "devicon-python-plain", name: "Python" },
            { icon: "devicon-python-plain", name: "FastAPI" },
            
            // DevOps & Integration
            { icon: "devicon-docker-plain", name: "Docker" },
            { icon: "devicon-github-plain", name: "GitHub" },
            // Machine Learning & Data Processing
            { icon: "devicon-numpy-plain", name: "NumPy" },
          ].map((tech, index) => (
            <div key={index} className="tech-item">
              <i className={`${tech.icon} colored`}></i>
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;