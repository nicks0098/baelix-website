const RELEASES_PAGE = 'https://github.com/nicks0098/baelix-website/releases/latest';
const LATEST_RELEASE_API = 'https://api.github.com/repos/nicks0098/baelix-website/releases/latest';

interface ReleaseAsset {
  name?: string;
  browser_download_url?: string;
}

interface LatestRelease {
  assets?: ReleaseAsset[];
}

export const onRequestGet: PagesFunction = async () => {
  try {
    const response = await fetch(LATEST_RELEASE_API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'BAELIX-Website',
      },
      cf: { cacheEverything: true, cacheTtl: 300 },
    });
    if (!response.ok) return Response.redirect(RELEASES_PAGE, 302);

    const release = await response.json<LatestRelease>();
    const installer = release.assets?.find(
      (asset) => asset.name?.toLowerCase().endsWith('-setup.exe') && asset.browser_download_url,
    );
    return Response.redirect(installer?.browser_download_url || RELEASES_PAGE, 302);
  } catch {
    return Response.redirect(RELEASES_PAGE, 302);
  }
};
