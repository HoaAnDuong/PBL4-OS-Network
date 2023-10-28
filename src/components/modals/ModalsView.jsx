import { memo } from "react";
import { Modal } from "../../features/modals/modal.js";
import ModalsManager from "../../features/modals/modal.js";
import { ModalView } from "./ModalView.jsx";
import styles from "./ModalsView.module.css";

/**
 * @param {object} root 
 * @param {ModalsManager} root.modalsManager 
 * @param {Modal[]} root.modals 
 * @param {import("react").CSSProperties} root.style 
 * @param {import("react").className} root.className 
 */
export const ModalsView = memo(({ modalsManager, modals, style, className }) => {
	return (
		<div style={style} className={`${styles.Container} ${className}`}>
			{modals?.map((modal) =>
				<ModalView key={modal.id} modal={modal}/>
			)}
		</div>
	);
});