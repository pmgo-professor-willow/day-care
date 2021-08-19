// Node modules.
import _ from 'lodash';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import urlJoin from 'url-join';

interface Post {
  title: string;
  link: string;
  date: string;
  coverImageUrl: string;
}

const getActionRuns = async (repoName: string, amount = 5) => {
  const url = urlJoin(`https://github.com/${repoName}/actions`);
  const res = await fetch(url);
  const xml = await res.text();

  const root = parse(xml);

  const items = root.querySelectorAll(`[data-url="/${repoName}/actions/workflow-runs"] div`);
  const runs = items.slice(0, amount).map((item) => {
    const time = item.querySelector('time-ago').getAttribute('datetime');
    // Running: This workflow run is currently running.
    // Succeed: This workflow run completed successfully.
    //  Failed: This workflow run failed.
    const summary = item.querySelector('.checks-list-item-icon svg').parentNode.getAttribute('title');
    let status = 'none';
    if (summary?.includes('running')) {
      status = 'running';
    } else if (summary?.includes('successfully')) {
      status = 'succeed';
    } else if (summary?.includes('failed')) {
      status = 'failed';
    }

    return {
      time,
      status,
    };
  });

  return runs;
};

export {
  getActionRuns,
};
