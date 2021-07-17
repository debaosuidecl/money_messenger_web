import React from "react";
import Skeleton from "react-loading-skeleton";

function MySkeletonLoader() {
  return (
    <div>
      <>
        <div style={{ fontSize: 50, lineHeight: 1.1, marginTop: 30 }}>
          <Skeleton count={1} />
        </div>
        <div style={{ fontSize: 50, lineHeight: 1.1, marginTop: 30 }}>
          <Skeleton count={1} />
        </div>
        <div style={{ fontSize: 150, lineHeight: 1.1, marginTop: 30 }}>
          <Skeleton count={1} />
        </div>
      </>
    </div>
  );
}

export default MySkeletonLoader;
