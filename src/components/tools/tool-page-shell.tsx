import type {ToolPageShellContent} from "@/lib/tools";

import {ToolExampleSection} from "@/components/tools/tool-example-section";
import {ToolFaqSection} from "@/components/tools/tool-faq-section";
import {ToolHistorySection} from "@/components/tools/tool-history-section";
import {ToolLinkSection} from "@/components/tools/tool-link-section";
import {ToolListSection} from "@/components/tools/tool-list-section";
import {ToolOperationPanel} from "@/components/tools/tool-operation-panel";
import {ToolStepsSection} from "@/components/tools/tool-steps-section";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {Card} from "@/components/ui/card";
import {Container} from "@/components/ui/container";
import {LocalProcessingBadge} from "@/components/ui/local-processing-badge";
import {SectionHeading} from "@/components/ui/section-heading";

type Props = ToolPageShellContent;

export function ToolPageShell({
  breadcrumbLabel,
  breadcrumbs,
  emptyStates,
  exampleLabels,
  localProcessingLabel,
  sectionLabels,
  tool,
}: Props) {
  return (
    <main id="main-content">
      <Container className="py-12 sm:py-16">
        <div className="space-y-8">
          <Breadcrumbs items={breadcrumbs} label={breadcrumbLabel} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px] xl:items-start">
            <div className="space-y-5">
              <p className="inline-flex rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-semibold tracking-[0.2em] text-[#215da8]">
                {tool.category}
              </p>
              <SectionHeading
                description={tool.description}
                title={tool.title}
                titleAs="h1"
              />
              <LocalProcessingBadge label={localProcessingLabel} />
            </div>

            <Card className="p-6 sm:p-7" tone="soft">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {sectionLabels.supportedFormats}
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {tool.supportedFormats.map((format) => (
                  <span
                    className="rounded-full border border-[#d7e3f1] bg-white px-3 py-2 text-sm text-foreground/80"
                    key={format}
                  >
                    {format}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <ToolOperationPanel operation={tool.operation} />

          <div className="grid gap-5 xl:grid-cols-2">
            <ToolListSection
              columns="two"
              items={tool.capabilities}
              title={sectionLabels.capabilities}
            />
            <ToolListSection items={tool.idealFor} title={sectionLabels.idealFor} />
          </div>

          <ToolStepsSection items={tool.steps} title={sectionLabels.steps} />

          <ToolExampleSection
            items={tool.examples}
            labels={exampleLabels}
            title={sectionLabels.examples}
          />

          <ToolListSection items={tool.cautions} title={sectionLabels.cautions} />

          <ToolFaqSection items={tool.faq} title={sectionLabels.faq} />

          <div className="grid gap-6 xl:grid-cols-2">
            <ToolLinkSection
              emptyState={emptyStates.relatedTools}
              items={tool.relatedTools}
              title={sectionLabels.relatedTools}
            />
            <ToolLinkSection
              emptyState={emptyStates.relatedArticles}
              items={tool.relatedArticles}
              title={sectionLabels.relatedArticles}
            />
          </div>

          <ToolHistorySection items={tool.history} title={sectionLabels.history} />
        </div>
      </Container>
    </main>
  );
}
