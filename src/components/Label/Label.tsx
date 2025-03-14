type LabelProps = {
  htmlFor: string;
  hasError?: boolean;
  children: React.ReactNode;
};

const Label = ({ htmlFor, children, hasError }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium cursor-pointer ${
        hasError && 'text-red-500'
      }`}
    >
      {children}
    </label>
  );
};

export default Label;
