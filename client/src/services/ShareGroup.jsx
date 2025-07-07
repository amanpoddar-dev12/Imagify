import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";

export default function ShareGroup({ imageUrl, title, summary }) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <FacebookShareButton url={imageUrl} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={imageUrl} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton url={imageUrl} title={title} summary={summary}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );
}
