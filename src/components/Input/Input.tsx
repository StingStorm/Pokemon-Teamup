import { forwardRef, InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  id?: string;
  placeholder?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, onBlur, name, error, placeholder, id }, ref) => {
    return (
      <input
        className={`min-h-8 px-3 py-1 border rounded-[0.25rem] ${
          error
            ? 'border-red-500 shadow-[0_0_0_1px_rgb(239,68,68)]'
            : 'border-gray-400  hover:border-purple-800 hover:shadow-[0_0_0_1px_rgb(107,33,168)] focus:border-purple-800 focus:shadow-[0_0_0_1px_rgb(107,33,168)]'
        }`}
        type="text"
        ref={ref}
        name={name}
        id={id || name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    );
  }
);

export default Input;
