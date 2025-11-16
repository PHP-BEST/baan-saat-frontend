import { filterPosts } from '@/api/post';
import { useState, useEffect, type FormEvent } from 'react';
import { useUser } from '@/context/UserContext';
import type { Post } from '@/interfaces/Post';
import Loading from '@/components/our-components/loading';
import PostList from '@/components/our-components/PostList';
import ActionButton from '@/components/our-components/actionButton';
import {
  createOffer,
  getOffersByProviderId,
  type OfferFormInterface,
} from '@/api/offer';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';

export default function OfferModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasOffer, setHasOffer] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [selectedFormData, setSelectedformData] = useState<
    OfferFormInterface[]
  >([]);
  const { userId } = useParams();
  if (!user || !userId) return;
  useEffect(() => {
    if (!open) return;
    const fetchUserPosts = async () => {
      setLoading(true);
      const userPosts = await filterPosts({
        userId: user._id,
        isMatched: false,
      });
      const providerOffers = await getOffersByProviderId(userId);
      const offerPostIds = new Set(providerOffers.map((o) => o.postId));
      const filteredPosts = userPosts.filter(
        (post) => !offerPostIds.has(post._id),
      );
      setPosts(filteredPosts);
      setLoading(false);
    };

    fetchUserPosts();
  }, [open]);
  const handleCheckboxChange = (post: Post, checked: boolean) => {
    if (checked) {
      setHasOffer(true);
      setSelectedformData((prev) => [
        ...prev,
        {
          customerId: post.customerId,
          providerId: userId,
          postId: post._id,
          title: post.title,
          price: post.budget,
        },
      ]);
    } else {
      if (selectedFormData.length === 1) setHasOffer(false);
      setSelectedformData((prev) => prev.filter((x) => x.postId !== post._id));
    }
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const success = await createOffer(selectedFormData);

    if (success) {
      setSelectedformData([]);
      setHasOffer(false);
    } else {
      alert('Failed to offer. Please try again.');
    }
    setOpen(false);
    window.location.href = `/account/post`;
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-[#777BB3] text-white text-xs px-4 py-1 rounded-3xl hover:bg-[#464a85] active:bg-[#191b40]">
                Select For Your Post
              </button>
            </DialogTrigger>
            <DialogContent
              className="bg-white rounded-md w-[40%] p-0"
              showCloseButton={false}
            >
              <DialogHeader>
                <DialogTitle className="border-b border-gray-400 mt-0">
                  <div className="text-gray-600 flex justify-between items-center h-10">
                    <div className="px-3 py-1 text-sm">
                      Select For Your Post
                    </div>
                    <DialogClose asChild>
                      <div
                        role="button"
                        className="rounded-tr-md h-full px-3 items-center hover:bg-red-600 active:bg-red-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          className="w-4 flex h-full"
                        >
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                      </div>
                    </DialogClose>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="mb-0 max-h-[60vh] overflow-y-auto">
                <div className="min-h-[40vh] w-full h-full flex flex-col items-center">
                  <Loading />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </>
    );
  }
  return (
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
        <DialogTrigger asChild>
          <button className="bg-[#777BB3] text-white text-xs px-4 py-1 rounded-3xl hover:bg-[#464a85] active:bg-[#191b40] cursor-pointer">
            Select For Your Post
          </button>
        </DialogTrigger>
        <DialogContent
          className="bg-white rounded-md w-[40%] p-0"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="border-b border-gray-400 mt-0">
              <div className="text-gray-600 flex justify-between items-center h-10">
                <div className="px-3 py-1 text-sm">Select For Your Post</div>
                <DialogClose asChild>
                  <div
                    role="button"
                    className="rounded-tr-md h-full px-3 items-center hover:bg-red-600 active:bg-red-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      className="w-4 flex h-full"
                    >
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                  </div>
                </DialogClose>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mb-0 max-h-[60vh] overflow-y-auto">
            <div className="min-h-[40vh]">
              {posts.length > 0 ? (
                posts.map((post: Post) => {
                  return (
                    <div
                      key={post._id}
                      className="w-full grid grid-cols-[5fr_0.5fr] hover:bg-gray-200 gap-4"
                    >
                      <PostList
                        title={post.title}
                        budget={post.budget}
                        date={post.date}
                        id={post._id}
                      />
                      <div className="flex items-center">
                        <input
                          className="w-4 h-4 bg-gray-400 ms-1"
                          type="checkbox"
                          onChange={(e) =>
                            handleCheckboxChange(post, e.target.checked)
                          }
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-sm">
                    {"Sorry, we couldn't find Your Post that can be offered"}
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="border-t border-gray-400">
            <div className="flex justify-end p-2">
              <ActionButton
                className="cursor-pointer p-0 h-8"
                buttonColor="blue"
                fontSize={16}
                onClick={() => handleSubmit()}
                disabled={!hasOffer}
              >
                Offer
              </ActionButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
