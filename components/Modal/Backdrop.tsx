import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

export default function Backdrop({ children, onClick }: Props) {
  return (
    <motion.div
      onClick={onClick}
      className="fixed inset-0 z-40 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.1 } }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}
