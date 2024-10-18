import Link from 'next/link';

import { Button, Card } from '@smar/ui';

import { useModules } from 'features/store/use-modules';

export const ModulesBanner = () => {
  const { allCategories } = useModules();

  return (
    <div>
      <Card boxshadow="shadow1" className="bg-secondaryDarkBlue900 relative">
        <img
          src="/bg.png"
          alt=""
          role="presentation"
          className="absolute bottom-0 left-0 top-0 w-full h-full object-cover"
        />
        <div className="relative flex flex-col items-center justify-between w-full">
          <div />
          <div className="flex flex-col items-center justify-center">
            <h2 className="v-h600 text-secondaryDarkBlue950 text-center">
              Use Modern Methods <br /> of Solving Problems
            </h2>
            <p className="v-sub170 text-secondaryDarkBlue950 mt-12px">
              Function Modules help you not to waste time on calculations
            </p>
            <div className="mt-4">
              <Link href="/store/modules/all" passHref>
                <Button as="a" size="md" style={{ width: 275 }}>
                  Start browsing
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <div
              className="hidden flex-wrap gap-3 justify-center mb-3 mt-4 xl:flex"
              style={{ maxWidth: 897 }}
            >
              {allCategories?.data?.payload.map(item => (
                <div
                  key={item.id}
                  className="rounded-large flex flex-col gap-2 items-center justify-center w-20 h-20 bg-white"
                >
                  <div className="w-5 h-5">
                    <img src={item.icon?.url} alt="" className="w-full" />
                  </div>
                  <div>
                    <p className="v-h160 text-secondaryDarkBlue900 text-center">{item.name}</p>
                    <p className="v-text130 text-secondaryDarkBlue910 text-center">
                      {item.publishedComputationModulesCount} Modules
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
