import { Tooltip } from "antd";
import { FiCopy } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { copyText } from "../../utils";
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion';
import { useState } from 'react';
const CopyText = ({ messageApi = null, text, showIcon = true }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    copyText(text, () => {
      messageApi?.open({
        type: "success",
        content: t("copy-success"),
      });
      setCopied(true);
    });
  };
  return (
    <Tooltip
      placement="topLeft"
      destroyTooltipOnHide
      overlayClassName="custom-tooltip"
      title={
        <div className="relative">
          <span className="text-xs inline">{text}</span>
          {
            showIcon && (
              <div className="absolute bottom-[4px] inline w-[14px] h-[14px] overflow-hidden translate-x-1">
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: copied ? -20 : 0 }}
                  transition={{ type: "spring", stiffness: 50, damping: 10 }}
                >
                  <FiCopy
                    className="cursor-pointer"
                    onClick={handleCopy}
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: copied ? -14 : 20, opacity: copied ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 50, damping: 10 }}
                >
                  <FaCheckCircle className="text-[#24c197]" />
                </motion.div>
              </div>
            )
          }
        </div>
      }
      onOpenChange={(show) => {
        if (!show) {
          setCopied(false)
        }
      }}
    >
      <div className="cursor-pointer hover:text-themeColor h-full overflow-hidden">{text}</div>
    </Tooltip>
  )
}

export default CopyText;