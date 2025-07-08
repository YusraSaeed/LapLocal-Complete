// const InputField = ({ type = "text", placeholder, value, onChange, required = true }) => {
//     return (
//         <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
//         />
//     );
// };
// export default InputField;
"use client"

const InputField = ({ type = "text", placeholder, value, onChange, required = true }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
    />
  )
}
export default InputField
