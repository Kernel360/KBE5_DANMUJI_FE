import { Logo, LogoImage } from "./UserPage.styled";
import danmujiLogo from "/assets/danmuji_logo.png";

export const DanmujiLogo = () => (
  <Logo>
    <LogoImage src={danmujiLogo} alt="Logo" />
  </Logo>
);
