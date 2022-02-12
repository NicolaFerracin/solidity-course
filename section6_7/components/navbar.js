import { Menu } from "semantic-ui-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <Menu pointing secondary>
      <Menu.Item>
        <Link href="/">
          <a>CrowdCoin</a>
        </Link>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <Link href="/">
            <a>Campaigns</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/campaigns/new">
            <a>Create new</a>
          </Link>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
