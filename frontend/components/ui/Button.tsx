interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function Button({ text, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all"
    >
      {text}
    </button>
  );
}
