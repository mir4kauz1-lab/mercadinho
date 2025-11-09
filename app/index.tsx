import { Redirect } from "expo-router";

export default function Index() {
  // Route groups are not part of the public URL schema; redirect using visible segment
  return <Redirect href="/splash" />;
}
