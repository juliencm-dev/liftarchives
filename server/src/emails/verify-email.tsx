import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import { colors, fontFamily, logoSvg } from "./styles";

interface VerifyEmailProps {
  userName: string;
  verificationUrl: string;
}

const iconDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

export function VerifyEmail({ userName, verificationUrl }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your Lift Archives email address</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <table cellPadding="0" cellSpacing="0" style={{ margin: "0 auto" }}>
              <tr>
                <td style={logoIcon}>
                  <Img
                    src={iconDataUri}
                    width="28"
                    height="28"
                    alt=""
                    style={{ display: "block" }}
                  />
                </td>
                <td style={logoText}>Lift Archives</td>
              </tr>
            </table>
          </Section>
          <Section style={card}>
            <Heading style={heading}>Verify your email</Heading>
            <Text style={greeting}>Hi {userName || "there"},</Text>
            <Text style={paragraph}>
              Thanks for signing up for Lift Archives! Please verify your email
              address to get started.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                Verify Email Address
              </Button>
            </Section>
            <Text style={fallback}>
              Or copy and paste this link into your browser:{" "}
              <Link href={verificationUrl} style={link}>
                {verificationUrl}
              </Link>
            </Text>
          </Section>
          <Text style={footer}>
            If you didn't create a Lift Archives account, you can safely ignore
            this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: colors.background,
  fontFamily,
  margin: "0",
  padding: "0",
};

const container = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px 20px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const logoIcon = {
  backgroundColor: colors.primary,
  borderRadius: "10px",
  verticalAlign: "middle" as const,
  padding: "8px",
};

const logoText = {
  fontSize: "24px",
  fontWeight: "700" as const,
  fontFamily,
  color: colors.foreground,
  paddingLeft: "10px",
  verticalAlign: "middle" as const,
};

const card = {
  backgroundColor: colors.card,
  borderRadius: "12px",
  padding: "40px 32px",
  border: `1px solid ${colors.border}`,
};

const heading = {
  fontSize: "22px",
  fontWeight: "600" as const,
  fontFamily,
  color: colors.foreground,
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const greeting = {
  fontSize: "15px",
  fontFamily,
  color: colors.foreground,
  margin: "0 0 8px",
};

const paragraph = {
  fontSize: "15px",
  fontFamily,
  color: colors.foreground,
  lineHeight: "1.6",
  margin: "0 0 24px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const button = {
  backgroundColor: colors.primary,
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600" as const,
  fontFamily,
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 32px",
};

const fallback = {
  fontSize: "13px",
  fontFamily,
  color: colors.mutedForeground,
  lineHeight: "1.5",
  wordBreak: "break-all" as const,
};

const link = {
  color: colors.primary,
};

const footer = {
  fontSize: "12px",
  fontFamily,
  color: colors.mutedForeground,
  textAlign: "center" as const,
  marginTop: "24px",
};
