import { useMemo, useCallback } from 'react';

import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai';
import useFavorites from '../hooks/useFavorites';
import useCurrentUser from '../hooks/useCurrentUser';
import axios from 'axios';

interface FavoriteButtonProps {
	movieId: string;
}
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
	const { mutate: mutateFavorites } = useFavorites();
	const { data: currentUser, mutate } = useCurrentUser();

	const isFavorite = useMemo(() => {
		const list = currentUser?.favoriteIds || [];
		return list.includes(movieId);
	}, [movieId, currentUser]);

	const toggleFavorite = useCallback(async () => {
		let response;
		if (isFavorite) {
			response = await axios.delete('/api/favorite', { data: { movieId } });
		} else {
			response = await axios.post('/api/favorite', { movieId });
		}

		const updatedFavoriteIds = response?.data?.favoriteIds;
		mutate({ ...currentUser, favoriteIds: updatedFavoriteIds });
		mutateFavorites();
	}, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

	const Icon = isFavorite ? <AiOutlineCheck /> : <AiOutlinePlus />;

	return (
		<div
			onClick={toggleFavorite}
			className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
		>
			{/* <Icon className="text-white" size={25} /> */}
			{isFavorite ? (
				<AiOutlineCheck className="text-white" size={25} />
			) : (
				<AiOutlinePlus className="text-white" size={25} />
			)}
		</div>
	);
};

export default FavoriteButton;
