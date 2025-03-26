import React, { ReactElement, useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type Props = {
	text: string;
	tooltip?: string;
	children: ReactElement<unknown, any> | string;
};

const CopyToClipboard: React.FC<Props> = ({ text, tooltip = 'Скопировать', children }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	};

	return (
		<Tooltip
			title={
				copied ? (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minHeight: 30 }}>
						<CheckCircleIcon color="success" fontSize="small" />
						Скопировано!
					</Box>
				) : (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minHeight: 30 }}>
						<ContentCopyIcon fontSize="small" />
						{tooltip}
					</Box>
				)
			}
			arrow
		>
			<Box onClick={handleCopy} sx={{ display: "inline-flex", cursor: "pointer" }}>
				{children}
			</Box>
		</Tooltip>
	);
};

export default CopyToClipboard;
