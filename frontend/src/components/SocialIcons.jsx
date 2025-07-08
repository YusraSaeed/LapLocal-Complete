import googleIcon from "../assets/google-icon.svg";
import facebookIcon from "../assets/facebook-icon.svg";
import appleIcon from "../assets/apple-icon.svg";

const SocialIcons = ({ onGoogleLogin }) => {
    return (
        <div className="mt-4 flex justify-center space-x-4">
            <button onClick={onGoogleLogin} className="p-2 rounded-full hover:bg-gray-100">
                <img src={googleIcon} alt="Google" className="w-6 h-6" />
            </button>
            {/* <button className="p-2 rounded-full hover:bg-gray-100">
                <img 
                src={facebookIcon} 
                // src="/apple-icon.svg"
                alt="Facebook" className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
                <img 
                src={appleIcon} 
                // src="/apple-icon.svg"
                alt="Apple" className="w-6 h-6" />
            </button> */}
        </div>
    );
};

export default SocialIcons;