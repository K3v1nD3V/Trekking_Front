import LoadIcon from '../../../public/loadicon.png';
import '../../css/common/load.css';

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