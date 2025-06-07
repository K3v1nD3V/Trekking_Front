import LoadIcon from '../../../public/loadicon.png';
import '../../css/common/Load.css';

const Load = () => {
  return (
    <div className="load-container">
        <div className="load-icon">
            <img src={LoadIcon} alt="trakking icon" />
        </div>
    </div>
  );
}

export default Load;