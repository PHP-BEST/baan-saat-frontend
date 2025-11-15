import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import type { User } from '@/interfaces/User';
import { getUserById } from '@/api/user';
import Loading from '@/components/our-components/loading';
import { ChevronLeft, ChevronDown, Star, Funnel } from 'lucide-react';
import UserNotFound from '@/error/UserNotFound';
import type { Review } from '@/interfaces/Review';
import { getProviderReviews } from '@/api/review';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

function ratingHue(avg: number) {
  const t = Math.max(0, Math.min(1, (avg - 1) / 4));
  return 50 * t;
}

function AverageStars({ value }: { value: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Average rating ${value.toFixed(2)} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const starIndex = i + 1;
        const frac = Math.max(0, Math.min(1, value - (starIndex - 1)));
        const hue = ratingHue(value);
        return (
          <div key={i} className="relative w-6 h-6 text-gray-300">
            <Star className="absolute inset-0 w-6 h-6" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${frac * 100}%` }}
            >
              <Star
                className="w-6 h-6"
                style={{ color: `hsl(${hue} 90% 50%)`, fill: 'currentColor' }}
              />
            </div>
          </div>
        );
      })}
      <span className="ml-2 text-md font-bold">{value.toFixed(2)}/5</span>
    </div>
  );
}

type Stats = {
  total: number;
  avg: number;
  byStar: Record<1 | 2 | 3 | 4 | 5, number>;
};

function computeStats(list: Review[]): Stats {
  const byStar = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Stats['byStar'];
  let sum = 0;
  for (const r of list) {
    const k = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
    if (byStar[k] !== undefined) byStar[k] += 1;
    sum += r.rating;
  }
  const total = list.length;
  return {
    total,
    avg: total ? sum / total : 0,
    byStar,
  };
}

export default function ProviderProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [providerUser, setProviderUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'new' | 'old'>('new');
  const [starFilter, setStarFilter] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [contentFilter, setContentFilter] = useState<'all' | 'commented'>(
    'all',
  );

  useEffect(() => {
    const getProviderUser = async () => {
      setLoading(true);
      if (!userId) return;
      const user = await getUserById(userId);
      setProviderUser(user);
      setLoading(false);
    };
    getProviderUser();
  }, [userId]);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      setLoading(true);
      const r = await getProviderReviews(userId);
      setReviews(r.data.data);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="px-16 py-10 w-full min-h-screen flex flex-col gap-10 bg-white">
          <Loading />
        </div>
        <Footer />
      </div>
    );
  }

  if (!providerUser) {
    return (
      <div>
        <Header />
        <div className="px-16 py-10 w-full min-h-screen flex flex-col gap-10 bg-white">
          <UserNotFound />
        </div>
        <Footer />
      </div>
    );
  }

  const stats = computeStats(reviews);

  const filtered = reviews
    .filter((r) => {
      const desc = r.description ?? '';
      const searchTrimmedLower = search.trim().toLowerCase();
      const passesText = searchTrimmedLower
        ? desc.toLowerCase().includes(searchTrimmedLower)
        : true;
      const passesStar =
        starFilter === 0 ? true : Math.round(r.rating) === starFilter;
      const passesContent =
        contentFilter === 'all' ? true : desc.trim().length > 0;

      return passesText && passesStar && passesContent;
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === 'new' ? db - da : da - db;
    });

  const itemFilters =
    'hover:bg-gray-200 focus:bg-gray-200 data-[highlighted]:bg-gray-200 ' +
    'data-[state=checked]:bg-gray-600 data-[state=checked]:text-white';

  return (
    <>
      <Header />
      <div className="px-16 py-10 w-full min-h-screen flex flex-col gap-10 bg-white">
        {/* Header */}
        <div className="flex gap-6 items-center">
          {providerUser && (
            <>
              <div
                className={`bg-background-profile rounded-full flex items-center justify-center overflow-hidden`}
                style={{ width: 52, height: 52 }}
              >
                {providerUser.avatarUrl ? (
                  <img
                    src={providerUser.avatarUrl}
                    alt="Avatar Image"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {providerUser.name}’s Provider Profile
              </h1>
            </>
          )}
          <button
            className="flex gap-2 items-center text-button-action font-bold text-lg cursor-pointer ml-auto"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={32} />
            <p className="hover:underline">Back</p>
          </button>
        </div>

        {/* Content */}
        <div className="w-full h-fit border border-gray-400 rounded-3xl p-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl">Name</p>
              <p className="text-lg">
                {providerUser.name ? providerUser.name : 'Unknown'}
              </p>
            </div>
            <div className="flex flex-col text-lg gap-1">
              <p className="font-bold text-xl">Telephone</p>
              <p className="text-lg">
                {providerUser.telNumber ? providerUser.telNumber : '-'}
              </p>
            </div>
            <div className="flex flex-col text-lg gap-1">
              <p className="font-bold text-xl">Email</p>
              <p className="text-lg">
                {providerUser.email ? providerUser.email : '-'}
              </p>
            </div>
            <div className="flex flex-col text-lg gap-1">
              <p className="font-bold text-xl">Description</p>
              <p className="text-lg">
                {providerUser.providerProfile?.description
                  ? providerUser.providerProfile?.description
                  : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews*/}
        <div className="mt-0">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Summarized review panel*/}
            <div className="rounded-2xl bg-white p-5 w-full max-w-lg">
              <div className="flex items-center justify-between">
                <AverageStars value={stats.avg} />
                <span className="text-md font-bold">{stats.total} reviews</span>
              </div>

              <div className="mt-4 space-y-2">
                {[5, 4, 3, 2, 1].map((s) => {
                  const count = stats.byStar[s as 1 | 2 | 3 | 4 | 5] || 0;
                  const pct = stats.total
                    ? Math.round((count / stats.total) * 100)
                    : 0;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <span className="w-8 text-md font-bold">{s} ★</span>
                      <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background:
                              'linear-gradient(90deg, #ef4444 0%, #f59e0b 100%)',
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-md text-muted-foreground">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All reviews */}
            <div className="md:col-span-2 rounded-2xl border border-gray-400 bg-white p-5">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search review text …"
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2 font-bold hover:bg-gray-200"
                      aria-label="Open filters"
                    >
                      <Funnel></Funnel>
                      Filters
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="z-50 w-56 rounded-xl border bg-white p-2 shadow-xl font-serif"
                  >
                    <DropdownMenuLabel>Sort</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={sort}
                      onValueChange={(v) => setSort(v as 'new' | 'old')}
                    >
                      <DropdownMenuRadioItem
                        value="new"
                        className={itemFilters}
                      >
                        Newest first
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="old"
                        className={itemFilters}
                      >
                        Oldest first
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>Stars</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={String(starFilter)}
                      onValueChange={(v) =>
                        setStarFilter(Number(v) as 0 | 1 | 2 | 3 | 4 | 5)
                      }
                    >
                      <DropdownMenuRadioItem value="0" className={itemFilters}>
                        All reviews
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="5" className={itemFilters}>
                        5 stars
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="4" className={itemFilters}>
                        4 stars
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="3" className={itemFilters}>
                        3 stars
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="2" className={itemFilters}>
                        2 stars
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="1" className={itemFilters}>
                        1 star
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
                      Content
                    </DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={contentFilter}
                      onValueChange={(v) =>
                        setContentFilter(v as 'all' | 'commented')
                      }
                    >
                      <DropdownMenuRadioItem
                        value="all"
                        className={itemFilters}
                      >
                        All reviews
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="commented"
                        className={itemFilters}
                      >
                        With comments only
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* List */}
              <div className="mt-4 divide-y divide-gray-300">
                {filtered.length === 0 && (
                  <div className="text-md text-muted-foreground py-6">
                    No matching review.
                  </div>
                )}

                {filtered.map((r) => (
                  <div key={r._id} className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-md text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString('th')}
                      </span>
                    </div>
                    {r.description && (
                      <p className="mt-2 text-md whitespace-pre-wrap">
                        {r.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
