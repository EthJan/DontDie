import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './VolunteerMatch.css';

const VolunteerMatch = ({ matchedOrganizations }) => {
    const [noMatch, setNoMatch] = useState(false);

    // so that the length is only checked on mount
    useEffect(() => {
        setNoMatch(matchedOrganizations.length === 0);
    }, [matchedOrganizations]);

    return (
        <div className="match">
            <h1>Nearby Helping Organizations</h1>
            <h3>{matchedOrganizations.length} relevant organizations found</h3>
            {noMatch ? (
                <p>We will keep you posted on any opportunities for you to help!</p>
            ) : (
                <ul>
                    {matchedOrganizations.map((organization) => (
                        <li key={organization.name}>
                            <h4>{organization.name}</h4>
                            <a href={organization.website}>{organization.website}</a>
                            <p>Approximately {organization.distance_km} km away from you</p>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

VolunteerMatch.propTypes = {
    matchedOrganizations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default VolunteerMatch;