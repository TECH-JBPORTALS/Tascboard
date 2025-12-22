interface SiteHeaderProps {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
}

export function SiteHeader({ startElement, endElement }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Optional start element */}
        {startElement && (
          <>
            <div className="flex items-center">{startElement}</div>
          </>
        )}

        {/* Right-aligned end element */}
        {endElement && (
          <div className="ml-auto flex items-center gap-2">{endElement}</div>
        )}
      </div>
    </header>
  );
}
