import type {AnchorHTMLAttributes, ReactNode} from "react";
import Link from "next/link";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
};

function isExternalHref(href: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);
}

export function AppLink({children, href, rel, ...props}: Props) {
  if (isExternalHref(href)) {
    return (
      <a href={href} rel={rel} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} rel={rel} {...props}>
      {children}
    </Link>
  );
}
