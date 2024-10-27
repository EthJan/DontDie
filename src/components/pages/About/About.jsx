import teamImage from '../../../assets/team.jpg';
import './About.css';

const About = () => {
    return (
        <div className="about">
        <h1>About Safelink</h1>
            <p>Over the past 50 years, the number of disasters worldwide experienced a fivefold increase, affecting millions of people each year. These natural disasters come in different ways and come without warning, leaving communities in urgent need of resources, aid, and volunteers. That’s where the idea for Safelink came from. We realized there was a need for a platform connecting everyday citizens to critical information about natural disasters.</p>
            <p>Introducing Safelink: We connect people to critical information and volunteering opportunities in real-time. Whether you're affected by an event or ready to lend a helping hand, Safelink makes it easy to see, report, and respond to natural disasters around the world.</p>
            <img src={teamImage} alt="Safelink" width="500" height="200" />
        </div>
    );
}

export default About;