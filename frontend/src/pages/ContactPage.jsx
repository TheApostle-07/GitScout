import React from "react";
import "../styles/Contact.css"; // Ensure CSS file is properly linked

const teamMembers = [
  {
    name: "Rufus Bright",
    role: "Team Lead",
    image: "/images/rufus1.png",
    quote: "I can do all things through Christ who strengthens me.",
    verse: "- Philippians 4:13",
    portfolio: "https://astonishing-buttercream-aea79d.netlify.app/",
    socials: {
      github: "https://github.com/TheApostle-07",
      linkedin: "https://www.linkedin.com/in/rufus-bright-77399a1a3/",
      twitter: "https://x.com/bright_ruf93341",
    },
  },
  {
    name: "Gulshan Nagar",
    role: "Developer",
    image: "/images/gulshanPic3.png",
    quote: "Code is like humor. When you have to explain it, it’s bad.",
    verse: "- Cory House",
    portfolio: "https://gulshanportfollio.netlify.app/",
    socials: {
      github: "https://github.com/Gulshan-nagar",
      linkedin: "https://www.linkedin.com/in/gulshan-nagar-b9b847283",
      twitter: "https://x.com/nag62534",
    },
  },
  {
    name: "Rahul Verma",
    role: "Developer",
    image: "/images/Rahul.jpg",
    quote: "Simplicity is the ultimate sophistication.",
    verse: "- Leonardo da Vinci",
    portfolio: "https://rahulverma-portfolio.netlify.app/",
    socials: {
      github: "https://github.com/rahul-verma",
      linkedin: "https://www.linkedin.com/in/rahul-verma/",
      twitter: "https://x.com/rahulverma_dev",
    },
  },
];

const ContactUs = () => {
  return (
    <div className="contact-us">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-text">
        We value your questions, feedback, and insights. Let us know how we can assist you.
      </p>
      <p className="contact-text">
        For immediate assistance, call us at <strong>+91 951 039 4742</strong>. We're here to help.
      </p>

      <h2 className="team-title">Meet the Team</h2>
      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div className="horizontal-card" key={index}>
            <div className="image-container">
              <img src={member.image} alt={member.name} />
            </div>
            <div className="content-container">
              <h2>{member.name}</h2>
              <p className="role">{member.role}</p>
              <p className="quote">"{member.quote}"</p>
              {member.verse && (
                <p className="verse">
                  <em>{member.verse}</em>
                </p>
              )}
              <a
                href={member.portfolio}
                className="portfolio-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio
              </a>
              <div className="icons">
                <a href={member.socials.github} target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-github"></i>
                </a>
                <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-linkedin"></i>
                </a>
                <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactUs;