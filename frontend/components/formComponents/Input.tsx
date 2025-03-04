interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-left text-sm font-medium text-rose-950">{label}</label>}
      <input
        {...props}
        className="w-full p-2 border border-rose-300 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
    </div>
  );
}
