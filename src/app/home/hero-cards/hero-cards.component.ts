import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { dot } from 'node:test/reporters';
import { IntersectionObserverService } from '../../shared/services/intersection-observer.service';
import { PlatformCheckService } from '../../shared/services/platform-check.service';
import { getGenreNames } from '../../../assets/api-response/tmdb/Genres';
import { HeroCardComponent } from '../hero-card/hero-card.component';
import { ScrollButtonsComponent } from '../../shared/components/scroll-buttons/scroll-buttons.component';

@Component({
  selector: 'app-hero-cards',
  standalone: true,
  imports: [CommonModule, HeroCardComponent, ScrollButtonsComponent],
  templateUrl: './hero-cards.component.html',
  styleUrl: './hero-cards.component.scss',
})
export class HeroCardsComponent {
  indexOfFullyVisibleCard: number = 0;

  trendingTitles = [
    {
      backdrop_path: '/tncbMvfV0V07UZozXdBEq4Wu9HH.jpg',
      id: 573435,
      title: 'Bad Boys: Ride or Die',
      original_title: 'Bad Boys: Ride or Die',
      overview:
        'After their late former Captain is framed, Lowrey and Burnett try to clear his name, only to end up on the run themselves.',
      poster_path: '/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [28, 80, 53, 35],
      popularity: 2220.606,
      release_date: '2024-06-05',
      video: false,
      vote_average: 7.208,
      vote_count: 619,
      logoPath: '/A38YMEsKLrPftHlNABasQR1uj1R.svg',
    },
    {
      backdrop_path: '/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg',
      id: 94997,
      name: 'House of the Dragon',
      original_name: 'House of the Dragon',
      overview:
        'The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne. But when Viserys later fathers a son, the court is shocked when Rhaenyra retains her status as his heir, and seeds of division sow friction across the realm.',
      poster_path: '/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg',
      media_type: 'tv',
      adult: false,
      original_language: 'en',
      genre_ids: [10765, 18, 10759],
      popularity: 4054.786,
      first_air_date: '2022-08-21',
      vote_average: 8.412,
      vote_count: 4477,
      origin_country: ['US'],
      logoPath: '/2McArFsvD3oiNRejBKrXE0hf1PQ.png',
    },
    {
      backdrop_path: '/7cqKGQMnNabzOpi7qaIgZvQ7NGV.jpg',
      id: 76479,
      name: 'The Boys',
      original_name: 'The Boys',
      overview:
        'A group of vigilantes known informally as “The Boys” set out to take down corrupt superheroes with no more than blue-collar grit and a willingness to fight dirty.',
      poster_path: '/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg',
      media_type: 'tv',
      adult: false,
      original_language: 'en',
      genre_ids: [10765, 10759],
      popularity: 2386.335,
      first_air_date: '2019-07-25',
      vote_average: 8.472,
      vote_count: 10023,
      origin_country: ['US'],
      logoPath: '/tfYKXARoggNGvqq9LLnWBvBtPLw.png',
    },
    {
      backdrop_path: '/6HpRZeA0JdY5fRgl89KKExsvvwR.jpg',
      id: 774531,
      title: 'Young Woman and the Sea',
      original_title: 'Young Woman and the Sea',
      overview:
        'This is the extraordinary true story of Trudy Ederle, the first woman to successfully swim the English Channel. Through the steadfast support of her older sister and supportive trainers, she overcame adversity and the animosity of a patriarchal society to rise through the ranks of the Olympic swimming team and complete the 21-mile trek from France to England.',
      poster_path: '/bZlecCuBVvKuarNGvchBwaOsQ3c.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [36, 18],
      popularity: 96.711,
      release_date: '2024-05-31',
      video: false,
      vote_average: 7.806,
      vote_count: 67,
      logoPath: '/2SKPNqepdpfH8IzrDmkKEWcAVcz.png',
    },
    {
      backdrop_path: '/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
      id: 533535,
      title: 'Deadpool & Wolverine',
      original_title: 'Deadpool & Wolverine',
      overview:
        'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
      poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [878, 28, 35],
      popularity: 1111.732,
      release_date: '2024-07-24',
      video: false,
      vote_average: 7.8,
      vote_count: 19,
      logoPath: '/iELasLmGIX5JyjqrmL19ZoG8ITG.png',
    },
    {
      backdrop_path: '/iIvjwrDPQHCU4NjbbKpNs88uk6G.jpg',
      id: 1048241,
      title: 'My Spy the Eternal City',
      original_title: 'My Spy the Eternal City',
      overview:
        'JJ, a veteran CIA agent, reunites with his protégé Sophie, in order to prevent a catastrophic nuclear plot targeting the Vatican.',
      poster_path: '/Bf3vCfM94bSJ1saZlyi0UW0e0U.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [28, 35],
      popularity: 538.196,
      release_date: '2024-07-18',
      video: false,
      vote_average: 7,
      vote_count: 99,
    },
    {
      backdrop_path: '/7aPrv2HFssWcOtpig5G3HEVk3uS.jpg',
      id: 718821,
      title: 'Twisters',
      original_title: 'Twisters',
      overview:
        'As storm season intensifies, the paths of former storm chaser Kate Carter and reckless social-media superstar Tyler Owens collide when terrifying phenomena never seen before are unleashed. The pair and their competing teams find themselves squarely in the paths of multiple storm systems converging over central Oklahoma in the fight of their lives.',
      poster_path: '/bYmszCd9kRbwmXWvxMai9Mm9B92.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [28, 12, 53],
      popularity: 770.486,
      release_date: '2024-07-10',
      video: false,
      vote_average: 7.376,
      vote_count: 170,
    },
    {
      backdrop_path: '/vX71TGviqLsOtDNJ9q1QR4m14kH.jpg',
      id: 218589,
      name: 'Those About to Die',
      original_name: 'Those About to Die',
      overview:
        'Within the spectacular, complex and corrupt world of gladiatorial sports in Ancient Rome, follow an ensemble of diverse characters across the many layers of Roman society where sports, politics and business intersect and collide.',
      poster_path: '/gvz0m4MJ8sAj6yMcQdwN07bNjRY.jpg',
      media_type: 'tv',
      adult: false,
      original_language: 'en',
      genre_ids: [18],
      popularity: 565.964,
      first_air_date: '2024-07-18',
      vote_average: 7.773,
      vote_count: 23,
      origin_country: ['US'],
    },
    {
      backdrop_path: '/UbHKkZAf11zZWxnrq3HDaF150c.jpg',
      id: 96648,
      name: 'Sweet Home',
      original_name: '스위트홈',
      overview:
        'As humans turn into savage monsters and the world plunges into terror, a handful of survivors fight for their lives — and to hold on to their humanity.',
      poster_path: '/7wbPHetLZnyL6hwqrfEPnLNKnXu.jpg',
      media_type: 'tv',
      adult: false,
      original_language: 'ko',
      genre_ids: [18, 10765, 80],
      popularity: 1260.085,
      first_air_date: '2020-12-18',
      vote_average: 8.349,
      vote_count: 1283,
      origin_country: ['KR'],
    },
    {
      backdrop_path: '/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg',
      id: 1022789,
      title: 'Inside Out 2',
      original_title: 'Inside Out 2',
      overview:
        "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve long been running a successful operation by all accounts, aren’t sure how to feel when Anxiety shows up. And it looks like she’s not alone.",
      poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [16, 10751, 12, 35],
      popularity: 5165.407,
      release_date: '2024-06-11',
      video: false,
      vote_average: 7.646,
      vote_count: 2012,
    },
    {
      backdrop_path: '/peE1ax04MnTQ9ChDryoDNF95r5.jpg',
      id: 1255350,
      title: 'Find Me Falling',
      original_title: 'Find Me Falling',
      overview:
        'After a failed comeback album, rock star John Allman escapes to a dreamy Mediterranean island, only to discover that his new cliffside home has an unfortunate notoriety that attracts unwanted visitors and an old flame.',
      poster_path: '/pMWpIPJgL4lYNKxSVMRDFWITeMW.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [10749, 35, 10402],
      popularity: 209.387,
      release_date: '2024-07-19',
      video: false,
      vote_average: 6.242,
      vote_count: 31,
    },
    {
      backdrop_path: '/zymbuoBoL1i94xAOzVJF6IuWLfD.jpg',
      id: 77169,
      name: 'Cobra Kai',
      original_name: 'Cobra Kai',
      overview:
        'This Karate Kid sequel series picks up 30 years after the events of the 1984 All Valley Karate Tournament and finds Johnny Lawrence on the hunt for redemption by reopening the infamous Cobra Kai karate dojo. This reignites his old rivalry with the successful Daniel LaRusso, who has been working to maintain the balance in his life without mentor Mr. Miyagi.',
      poster_path: '/6GDW4EsgsXlYrL1ASb5eCHQK4er.jpg',
      media_type: 'tv',
      adult: false,
      original_language: 'en',
      genre_ids: [10759, 18, 35],
      popularity: 2449.129,
      first_air_date: '2018-05-02',
      vote_average: 8.217,
      vote_count: 6040,
      origin_country: ['US'],
    },
    {
      backdrop_path: '/fqv8v6AycXKsivp1T5yKtLbGXce.jpg',
      id: 653346,
      title: 'Kingdom of the Planet of the Apes',
      original_title: 'Kingdom of the Planet of the Apes',
      overview:
        "Several generations following Caesar's reign, apes – now the dominant species – live harmoniously while humans have been reduced to living in the shadows. As a new tyrannical ape leader builds his empire, one young ape undertakes a harrowing journey that will cause him to question all he's known about the past and to make choices that will define a future for apes and humans alike.",
      poster_path: '/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [878, 12, 28],
      popularity: 1573.61,
      release_date: '2024-05-08',
      video: false,
      vote_average: 7.141,
      vote_count: 2014,
    },
    {
      backdrop_path: '/wkPPRIducGfsbaUPsWfw0MCQdX7.jpg',
      id: 1051891,
      title: 'Thelma',
      original_title: 'Thelma',
      overview:
        'When 93-year-old Thelma Post gets duped by a phone scammer pretending to be her grandson, she sets out on a treacherous quest across the city to reclaim what was taken from her.',
      poster_path: '/rUcuageYgv9SsJoWuc0seRWG6JC.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [28, 35, 12],
      popularity: 91.423,
      release_date: '2024-06-21',
      video: false,
      vote_average: 7.3,
      vote_count: 27,
    },
    {
      backdrop_path: '/wNAhuOZ3Zf84jCIlrcI6JhgmY5q.jpg',
      id: 786892,
      title: 'Furiosa: A Mad Max Saga',
      original_title: 'Furiosa: A Mad Max Saga',
      overview:
        'As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus. Sweeping through the Wasteland they come across the Citadel presided over by The Immortan Joe. While the two Tyrants war for dominance, Furiosa must survive many trials as she puts together the means to find her way home.',
      poster_path: '/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [28, 12, 878],
      popularity: 1849.204,
      release_date: '2024-05-22',
      video: false,
      vote_average: 7.652,
      vote_count: 2253,
    },
    {
      backdrop_path: '/iYQlpBH9RHmoDVcvGsvNpG3Ikx5.jpg',
      id: 120549,
      name: 'Lady in the Lake',
      original_name: 'Lady in the Lake',
      overview:
        'When the disappearance of a young girl grips the city of Baltimore in 1966, the lives of two women converge on a fatal collision course.',
      poster_path: '/cK0zAfFHfpSZJ5e9yhm2jRJJ6Zj.jpg',
      media_type: 'tv',
      adult: false,
      original_language: 'en',
      genre_ids: [18, 80],
      popularity: 275.253,
      first_air_date: '2024-07-18',
      vote_average: 6.824,
      vote_count: 17,
      origin_country: ['US'],
    },
    {
      backdrop_path: '/kwronSXO1ogMqHHFvY2eBxfFLdn.jpg',
      id: 114479,
      name: 'The Acolyte',
      original_name: 'The Acolyte',
      overview:
        'A hundred years before the rise of the Empire, the Jedi Order and the Galactic Republic have prospered for centuries without war. During this time, an investigation into a shocking crime spree pits a Jedi Master against a dangerous warrior from his past.',
      poster_path: '/bnVL7o0r7rnOIFZMHr6eoDigpON.jpg',
      media_type: 'tv',
      adult: false,
      original_language: 'en',
      genre_ids: [9648, 10765],
      popularity: 562.148,
      first_air_date: '2024-06-04',
      vote_average: 5.689,
      vote_count: 360,
      origin_country: ['US'],
    },
    {
      backdrop_path: '/hOiQh0hvE6Iutimw9O0Pw5UkmYo.jpg',
      id: 258759,
      name: 'Strange Tales of Tang Dynasty II To the West',
      original_name: '唐朝诡事录之西行',
      overview: '',
      poster_path: '/mfCT8kjMVfLd9oC06MW0yQzATkW.jpg',
      media_type: 'tv',
      adult: false,
      original_language: 'zh',
      genre_ids: [9648],
      popularity: 111.138,
      first_air_date: '2024-07-18',
      vote_average: 6,
      vote_count: 1,
      origin_country: ['CN'],
    },
    {
      backdrop_path: '/Avtx5jsdPuDa091jvx2Lye3ygke.jpg',
      id: 1226578,
      title: 'Longlegs',
      original_title: 'Longlegs',
      overview:
        'In pursuit of a serial killer, an FBI agent uncovers a series of occult clues that she must solve to end his terrifying killing spree.',
      poster_path: '/dLAP1apgFIoBoPNw4HJLVACSu7u.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [80, 27, 53],
      popularity: 239.091,
      release_date: '2024-07-10',
      video: false,
      vote_average: 6.8,
      vote_count: 116,
    },
    {
      backdrop_path: '/fDmci71SMkfZM8RnCuXJVDPaSdE.jpg',
      id: 519182,
      title: 'Despicable Me 4',
      original_title: 'Despicable Me 4',
      overview:
        'Gru and Lucy and their girls — Margo, Edith and Agnes — welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad. Meanwhile, Gru faces a new nemesis in Maxime Le Mal and his femme fatale girlfriend Valentina, forcing the family to go on the run.',
      poster_path: '/3w84hCFJATpiCO5g8hpdWVPBbmq.jpg',
      media_type: 'movie',
      adult: false,
      original_language: 'en',
      genre_ids: [16, 10751, 35, 28],
      popularity: 4006.678,
      release_date: '2024-06-20',
      video: false,
      vote_average: 7.246,
      vote_count: 372,
    },
  ];

  heroTitles: TmdbTitle[] = this.trendingTitles
    .filter((_, index) => index < 5)
    .map((tmdbTitle) => {
      const sharedProps = {
        id: tmdbTitle.id,
        posterPath: tmdbTitle.poster_path,
        backdropPath: tmdbTitle.backdrop_path,
        logoPath: tmdbTitle.logoPath,
        plot: tmdbTitle.overview,
        genres: getGenreNames(
          tmdbTitle.media_type as TmdbMediaType,
          tmdbTitle.genre_ids
        ),
      };

      if (tmdbTitle.media_type === 'movie') {
        const movie = tmdbTitle as TmdbMovieProps;
        return {
          ...sharedProps,
          title: movie.title,
          releaseDate: movie.release_date,
        };
      } else {
        const series = tmdbTitle as TmdbSeriesProps;
        return {
          ...sharedProps,
          title: series.name,
          releaseDate: series.first_air_date,
        };
      }
    });

  constructor(
    private intersectionObserverService: IntersectionObserverService,
    private platformCheckService: PlatformCheckService
  ) {}

  get cards(): NodeListOf<Element> | undefined {
    if (this.platformCheckService.isServer()) {
      return undefined;
    } else {
      const cards = document.querySelectorAll('.hero-card');
      return cards ? cards : undefined;
    }
  }

  get posters(): NodeListOf<Element> | undefined {
    if (this.platformCheckService.isServer()) {
      return undefined;
    } else {
      const cards = document.querySelectorAll('.hero-card__poster');
      return cards ? cards : undefined;
    }
  }

  public stopCardsScrollBasedAnimation() {
    this.cards?.forEach((card) => {
      this.intersectionObserverService.unobserve(card);
    });
  }

  public startCardsScrollBasedAnimation() {
    if (this.platformCheckService.isServer()) {
      return;
    }

    const options = {
      // threshold: [
      //   0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65,
      //   0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1,
      // ],

      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };

    const intersectionHandlerCallback = (
      entries: IntersectionObserverEntry[]
    ) => {
      entries.forEach((entry) => {
        const intersectRatio = entry.intersectionRatio;
        const card = entry.target as HTMLElement;
        // const poster = entry.target.querySelector('.hero-card__poster') as HTMLElement;
        const indexOfCard = parseInt(
          card.getAttribute('data-card-index') as string
        );

        if (intersectRatio >= 0.8) {
          this.indexOfFullyVisibleCard = indexOfCard;
        }

        if (this.indexOfFullyVisibleCard !== indexOfCard) {
          card.style.transform = `scale(${
            0.8 + (1 - 0.8) * intersectRatio + 0.05
          })`;
          card.style.opacity = `${intersectRatio * 100 + 20}%`;
        }
      });
    };

    if (this.cards) {
      this.cards.forEach((card) => {
        const observer = this.intersectionObserverService;
        observer.observe(card, intersectionHandlerCallback, options);
      });
    }
  }
}

export interface TmdbTitle {
  title: string;
  id: number;
  posterPath: string;
  backdropPath: string;
  plot: string;
  genres: string[];
  logoPath?: string;
  releaseDate?: string;
}

interface TmdbMovieProps {
  backdrop_path: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  release_date: string;
  logoPath?: string;
}

interface TmdbSeriesProps {
  backdrop_path: string;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  first_air_date: string;
  logoPath?: string;
}

interface HeroTitles {
  title: string;
  id: number;
  posterPath: string;
  backdropPath: string;
  plot: string;
  genres: string[];
}

interface TrendingTmdbMovieProps {
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: TmdbMediaType;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

type TmdbMediaType = 'movie' | 'tv';

interface TrendingTmdbSeriesProps {
  backdrop_path: string;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: TmdbMediaType;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}
