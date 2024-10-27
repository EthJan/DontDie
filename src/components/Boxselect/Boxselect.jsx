import './Boxselect.css';
import PropTypes from 'prop-types';

const Boxselect = ({ options, selectedOptions, setSelectedOptions }) => {
    return (
      <div className="boxselect">
        {options.map(option => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions[option]}
                onChange={() => setSelectedOptions(option)}
              />
              {option}
            </label>
        ))}
      </div>
    );
};

Boxselect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.objectOf(PropTypes.bool).isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
};

export default Boxselect;