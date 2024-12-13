import { Inter, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import MessageProvider from "@/providers/MessageProvider";


// const roboto = Roboto({ subsets: ["latin"], weight: ['100', '400', '700'] });
const poppins = Poppins({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] })

export const metadata = {
  title: "UntangleBI | Customized Power BI Dashboards & Data Visualizations",
  description: "UntangleBI portal specializes in developing customized dashboards using Power BI, delivering advanced data visualizations and business intelligence (BI) solutions. Our tailored analytics help businesses unlock insights, streamline reporting, and make data-driven decisions. Keywords: data visualizations, business intelligence, Power BI, customized dashboards, analytics, reporting solutions, data insights, BI tools."
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={poppins.className}>
        <MessageProvider>
          {children}
        </MessageProvider>
      </body>
    </html>
  );
}
