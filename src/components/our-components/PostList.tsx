import { formatDateToDisplay } from '@/utils/function';
import { useNavigate } from 'react-router';
interface PostListProps {
  title: string;
  budget: number;
  date: Date;
  id: string;
}
export default function PostList({ title, budget, date, id }: PostListProps) {
  const navigate = useNavigate();
  return (
    <div
      className="grid grid-cols-[3fr_0.7fr_1.3fr] gap-x-4 px-3 my-1 cursor-pointer"
      onClick={() => {
        navigate(`/post/${id}`);
      }}
    >
      <div className="text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap ms-2 ">
        {title}
      </div>
      <div className="text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap min-w-[40px]">
        ฿ {budget}
      </div>
      <div className="text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap">
        {formatDateToDisplay(date)}
      </div>
    </div>
  );
}
