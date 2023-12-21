import styles from "./KOTView.module.css";
import { setKOT } from "../Redux/KOTSlice";
import { useSelector, useDispatch } from "react-redux";
import KOTCards from "./KOTCards";
import { AnimatePresence, motion } from "framer-motion";
import useSocket from "../Utils/useSocket";
import { useGetLiveKotsQuery } from "../Utils/customQueryHooks";
import { useQueryClient } from "react-query";

function KOTView() {
	const queryClient = useQueryClient();
	const sortType = useSelector(state => state.bigMenu.defaultSettings.kot_view_sort);

	const { data: KOTs, isLoading, isError, error } = useGetLiveKotsQuery();

	useSocket("KOTs", data => {
		queryClient.setQueryData("KOTs", data);
	});

	if (isLoading) return <div>LOADING....</div>;

	if (isError) {
		console.log(error);
		return <div>sorry...something broke....</div>;
	}
	return (
		<motion.main layout className={styles.mainKOT} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}>
			<AnimatePresence>
				{KOTs?.filter(kot => kot.kot_status === "accepted")
					.slice()
					.sort((a, b) => (sortType === "asc" ? a.id - b.id : b.id - a.id))
					.map((KOT, idx) => {
						return <KOTCards KOT={KOT} key={KOT.id} idx={idx} />;
					})}
			</AnimatePresence>
		</motion.main>
	);
}

export default KOTView;
