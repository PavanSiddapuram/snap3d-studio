import { motion } from "framer-motion";
import { Footer } from "./Footer";

export function PageShell({
  children,
  hideFooter = false,
}: {
  children: React.ReactNode;
  hideFooter?: boolean;
}) {
  return (
    <>
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="pt-16 min-h-screen"
      >
        {children}
      </motion.main>
      {!hideFooter && <Footer />}
    </>
  );
}
