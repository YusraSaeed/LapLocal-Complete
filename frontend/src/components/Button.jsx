

const Button = ({ children, type = "button", isLoading = false, ...props }) => {
    return (
        <button
        type={type}
        disabled={isLoading}
        className="w-full bg-black text-white py-3 rounded-full transform transition-transform duration-300 hover:scale-105 hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
        {...props}
        >
        {isLoading ? "Loading..." : children}
        </button>
    );
};

export default Button;
