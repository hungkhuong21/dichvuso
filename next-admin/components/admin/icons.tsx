import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

function BaseIcon({
  title,
  children,
  ...props
}: React.PropsWithChildren<IconProps>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

export function IconBell(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M15 17H9c-1.657 0-3-1.343-3-3v-3a6 6 0 0 1 12 0v3c0 1.657-1.343 3-3 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

export function IconLayoutDashboard(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M4 4h7v9H4V4ZM13 4h7v5h-7V4ZM13 11h7v9h-7v-9ZM4 15h7v5H4v-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </BaseIcon>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M4 4h7v7H4V4ZM13 4h7v7h-7V4ZM4 13h7v7H4v-7ZM13 13h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </BaseIcon>
  );
}

export function IconTag(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M20 13 13 20a2 2 0 0 1-2.828 0L3 12V4h8l9 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 7.5h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

export function IconPanelLeft(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M4 5.5h16c.828 0 1.5.672 1.5 1.5v10c0 .828-.672 1.5-1.5 1.5H4c-.828 0-1.5-.672-1.5-1.5V7c0-.828.672-1.5 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 6v12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

