import React, { useEffect, useRef, useState } from 'react';
import { IoArrowBackSharp, IoArrowForwardSharp } from 'react-icons/io5';
import { Loader1, Loader2 } from './Loader';
import { pagination } from '../../config/constants';

interface PaginationProps {
  loading: boolean;
  offset: number;
  setOffset: (offset: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  count: number;
  total: number | null;
}

export function Pagination({
  loading,
  offset,
  setOffset,
  limit,
  setLimit,
  count,
  total,
}: PaginationProps) {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [debouncedOffset, setDebouncedOffset] = useState(offset);
  const [debouncedLoading, setDebouncedLoading] = useState(false);
  const [leftDisabled, setLeftDisabled] = useState(false);
  const [rightDisabled, setRightDisabled] = useState(false);

  const [showLoading, setShowLoading] = useState(loading || debouncedLoading);

  useEffect(() => {
    setShowLoading(loading || debouncedLoading);
  }, [loading, debouncedLoading]);

  useEffect(() => {
    if (total !== null) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        setDebouncedLoading(false);
      }

      if (debouncedOffset !== offset) {
        setDebouncedLoading(true);
        debounceTimeout.current = setTimeout(async () => {
          setOffset(debouncedOffset);
          setDebouncedLoading(false);
        }, pagination.debounceTimeoutLength);
      }
    }
  }, [debouncedOffset, offset]);

  useEffect(() => {
    setLeftDisabled(total === null || debouncedOffset === 0);
    setRightDisabled(total === null || debouncedOffset + limit >= total);
  }, [debouncedOffset, limit, total]);

  const handleLeftClick = () => {
    setDebouncedOffset((prev) => Math.max(0, prev - limit));
  };

  const handleRightClick = () => {
    setDebouncedOffset((prev) => prev + limit);
  };

  return (
    <div className="flex flex-row items-center space-x-1">
      {showLoading && <Loader1 />}
      <span>
        {total !== null ? (
          <>
            {count > 1 && `${debouncedOffset + 1}-`}
            {Math.min(debouncedOffset + count, total)} of {total}
          </>
        ) : (
          <>x of x</>
        )}{' '}
      </span>
      <button disabled={leftDisabled} onClick={handleLeftClick}>
        <IoArrowBackSharp className={leftDisabled ? 'opacity-50' : ''} />
      </button>
      <button disabled={rightDisabled} onClick={handleRightClick}>
        <IoArrowForwardSharp className={rightDisabled ? 'opacity-50' : ''} />
      </button>
    </div>
  );
}
