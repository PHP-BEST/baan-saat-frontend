import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { Star, Smile, CheckCircle } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createReview } from '@/api/review';
import ActionButton from '@/components/our-components/actionButton';
import { Loader } from 'lucide-react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import axios from '@/config/axios-config';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

type RouteParams = {
  postId?: string;

  providerId?: string;
};

export default function ReviewCreate() {
  const { postId, providerId } = useParams<RouteParams>();
  const nav = useNavigate();
  const { user } = useUser();

  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [desc, setDesc] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [provider, setProvider] = useState<{
    _id: string;
    name?: string;
    avatarUrl?: string;
  } | null>(null);
  const [post, setPost] = useState<{ _id: string; title?: string } | null>(
    null,
  );
  const [successOpen, setSuccessOpen] = useState(false);

  const canSubmit = useMemo(
    () =>
      !!postId &&
      !!providerId &&
      !!user?._id &&
      rating >= 1 &&
      rating <= 5 &&
      !submitting,
    [postId, providerId, user?._id, rating, submitting],
  );

  const goHome = () => nav('/');

  useEffect(() => {
    (async () => {
      try {
        if (providerId) {
          const r = await axios.get(`/api/users/${providerId}`);
          setProvider(r.data?.data ?? r.data);
        }
        if (postId) {
          const r2 = await axios.get(`/api/posts/${postId}`);
          setPost(r2.data?.data ?? r2.data);
        }
      } catch {
        /* ignore for header */
      }
    })();
  }, [providerId, postId]);

  async function onSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setErr(null);
    await createReview({
      postId: postId!,
      providerId: providerId!,
      customerId: user!._id,
      rating,
      description: desc.trim() || undefined,
    });
    setSuccessOpen(true);
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
        <h1 className="text-3xl font-bold">Write a review</h1>
        <p className="mt-1 text-sm">
          Rate your experience for this provider and leave an optional comment.
        </p>

        {/* Provider + Post header */}
        <div className="rounded-2xl border border-gray-300 bg-white mt-2 pt-4 pb-4 pr-6 pl-6 shadow-md/20 flex items-center gap-4">
          {/* Avatar */}
          <div className="size-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
            {provider?.avatarUrl ? (
              <img
                src={provider.avatarUrl}
                alt={provider?.name ?? 'Provider'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-600">
                {(provider?.name?.[0] ?? 'P').toUpperCase()}
              </span>
            )}
          </div>

          {/* Texts */}
          <div className="min-w-0 flex-1">
            {/* Provider label + name on the same line */}
            <div className="flex items-baseline gap-2">
              <span className="text-md text-muted-foreground">Provider:</span>
              {providerId ? (
                <Link
                  to={`/user/${providerId}/provider`}
                  className="font-medium underline underline-offset-2 hover:text-primary hover:text-button-action
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`View ${provider?.name ?? 'provider'}'s profile`}
                >
                  {provider?.name ?? '—'}
                </Link>
              ) : (
                <span className="font-medium">{provider?.name ?? '—'}</span>
              )}
            </div>

            {/* Post line */}
            <div className="flex items-baseline gap-2">
              <span className="text-md text-muted-foreground">Post:</span>
              {postId ? (
                <Link
                  to={`/post/${postId}`}
                  className="font-medium underline underline-offset-2 hover:text-primary hover:text-button-action
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded truncate"
                  title={post?.title ?? `#${postId}`}
                  aria-label={`Open post ${post?.title ?? `#${postId}`}`}
                >
                  {post?.title ?? `#${postId}`}
                </Link>
              ) : (
                <span className="font-medium truncate">
                  {post?.title ?? '—'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6 rounded-2xl border-gray-500 bg-white border p-6 shadow-sm">
          {/* Rating */}
          <div>
            <label className="mb-2 block text-lg font-medium">Rating</label>
            <div
              role="radiogroup"
              aria-label="Star rating from 1 to 5"
              tabIndex={0}
              className="flex items-center gap-2"
            >
              {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => {
                const isFilled = (hover || rating) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    className="rounded p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onFocus={() => setHover(n)}
                    onBlur={() => setHover(0)}
                    onClick={() => setRating(n)}
                  >
                    <Star
                      className={`h-9 w-9 ${isFilled ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/40'}`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-lg">
                {rating ? `${rating}/5` : 'Select a rating'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="mb-2 block text-lg font-medium">
              Description{' '}
              <span className="text-muted-foreground">(optional)</span>
            </label>

            <div
              className="
            rounded-md border border-gray-400 bg-white shadow-sm overflow-hidden
            transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200
          "
            >
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={5}
                placeholder="Tell us about your experience ..."
                className="
              block w-full resize-y
              border-0 bg-transparent p-3 text-lg
              outline-none focus:outline-none focus:ring-0
            "
              />
            </div>

            <div className="mt-1 text-right text-lg text-muted-foreground">
              {desc.length}/2000
            </div>
          </div>

          {err && (
            <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {err}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <ActionButton
              type="button"
              buttonColor="blue"
              buttonType="filled"
              disabled={!canSubmit || submitting}
              className={`${canSubmit && !submitting ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              onClick={onSubmit}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader className="animate-spin" size={16} />
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </ActionButton>

            <ActionButton
              type="button"
              buttonColor="red"
              disabled={submitting}
              className={`${!submitting ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              onClick={() => nav(-1)}
            >
              Cancel
            </ActionButton>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="flex items-center gap-2 rounded-md bg-background-sidebar px-3 py-2 text-md">
              <Smile className="h-5 w-5" aria-hidden />
              <span>Thanks for your feedback. Have a nice day!</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <Dialog
        open={successOpen}
        onOpenChange={(open) => {
          setSuccessOpen(open);
          if (!open) goHome();
        }}
      >
        <DialogContent
          className="font-serif w-[min(90vw,720px)] md:max-w-2xl rounded-2xl border border-gray-300 bg-white shadow-xl"
          onPointerDownOutside={(e) => {
            e.preventDefault();
            goHome();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            goHome();
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="h-5 w-5 text-green-700" />
              Review submitted
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <ActionButton
              type="button"
              buttonColor="blue"
              disabled={submitting}
              onClick={() => {
                setSuccessOpen(false);
                nav(`user/${providerId}/provider?tab=reviews`);
              }}
            >
              View provider reviews
            </ActionButton>
            <ActionButton
              type="button"
              buttonColor="red"
              disabled={submitting}
              onClick={() => {
                setSuccessOpen(false);
                nav(`/`);
              }}
            >
              Back to home
            </ActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
