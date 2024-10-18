import { Card, Keywords } from '@smar/ui';

export const PortfolioDescription = ({
  portfolioModule,
}: {
  portfolioModule: Portfolio | PortfolioRequest;
}) => {
  return (
    <>
      <h2 className="v-text110 text-secondaryDarkBlue900 mb-1">Description</h2>
      <Card variant="sm" className="mb-3">
        <h3 className="v-label110 mb-1">Description</h3>
        <p className="v-p130">{portfolioModule.description}</p>
        <div className="mt-2">
          <h3 className="v-text110 text-secondaryDarkBlue900 mb-1">Keywords</h3>
          <Keywords data={(portfolioModule as any)?.keywords || []} />
        </div>
      </Card>
    </>
  );
};
