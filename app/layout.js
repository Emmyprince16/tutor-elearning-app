import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "FUTI E-Learning",
  description: "Tutor and Student E-Learning Meeting System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NavBar />
        {children}
      </body>
    </html>
  );
}