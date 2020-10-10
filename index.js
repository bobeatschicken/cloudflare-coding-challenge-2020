addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  element(element) {
    this.links.forEach((link) => {
      element.append(`<a href=${link.url}>${link.name}</a>`, {
        html: true,
      })
    })
  }
}

const ProfileTransformer = {
  element: (element) => {
    element.removeAttribute('style')
  },
}

const AvatarTransformer = {
  element: (element) => {
    element.setAttribute('src', 'https://i.imgur.com/CSTI7IT.jpg')
  },
}

const UsernameTransformer = {
  element: (element) => {
    element.setInnerContent('bobeatschicken')
  },
}

const TitleTransformer = {
  element: (element) => {
    element.setInnerContent('Christopher Yang')
  },
}

class SocialTransformer {
  constructor() {
    this.socialLinks = [
      { name: 'facebook', url: 'https://www.facebook.com/christopher.yang.3/' },
      { name: 'instagram', url: 'https://www.instagram.com/chris_yang_365/' },
    ]
  }
  element(element) {
    element.removeAttribute('style')
    this.socialLinks.forEach((link) => {
      element.append(
        `<a href=${link.url}><img style="filter:invert(1)" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/${link.name}.svg" /></a>`,
        {
          html: true,
        },
      )
    })
  }
}

const BodyTransformer = {
  element: (element) => {
    element.removeAttribute('class')
    element.setAttribute(
      'style',
      `background-image:url('https://i.redd.it/xob7iy25rez01.jpg');background-size:cover;background-position:center`,
    )
  },
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let requestURL = new URL(request.url)
  let path = requestURL.pathname
  const links = [
    { name: 'Osteologic', url: 'https://osteologic.herokuapp.com/' },
    { name: 'GitHub', url: 'http://github.com/bobeatschicken' },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/christopher-y-9b595b114/',
    },
  ]
  let response
  if (path === '/links') {
    const linksJSON = JSON.stringify(links)
    response = new Response(linksJSON, {
      'content-type': 'application/json;charset=UTF-8',
    })
  } else {
    await fetch('https://static-links-page.signalnerve.workers.dev').then(
      (res) => {
        response = new HTMLRewriter()
          .on('div#links', new LinksTransformer(links))
          .on('div#profile', ProfileTransformer)
          .on('img#avatar', AvatarTransformer)
          .on('h1#name', UsernameTransformer)
          .on('title', TitleTransformer)
          .on('div#social', new SocialTransformer())
          .on('body', BodyTransformer)
          .transform(res)
        response.headers.set('Content-Type', 'text/html;charset=UTF-8')
      },
    )
  }
  return response
}
