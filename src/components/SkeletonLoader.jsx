/**
 * ICUNI Connect — Skeleton Loaders
 * Layout-aware shimmer placeholders. Adapted from PrintShop SkeletonLoader.js
 */
import React from 'react';

function Block({ w = '100%', h = '20px', mb = '12px', radius, style = {} }) {
  return (
    <div className="shimmer" style={{
      width: w, height: h, marginBottom: mb,
      borderRadius: radius || 'var(--radius-md)', ...style,
    }} />
  );
}

function StatSkeleton() {
  return (
    <div className="card" style={{ padding: 'var(--space-lg)', minHeight: '90px' }}>
      <Block w="60%" h="28px" mb="8px" />
      <Block w="40%" h="14px" mb="0" />
    </div>
  );
}

function TalentCardSkeleton() {
  return (
    <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
      <Block w="80px" h="80px" mb="12px" radius="50%" style={{ margin: '0 auto 12px' }} />
      <Block w="70%" h="16px" mb="8px" style={{ margin: '0 auto 8px' }} />
      <Block w="50%" h="12px" mb="12px" style={{ margin: '0 auto 12px' }} />
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
        <Block w="60px" h="24px" mb="0" radius="var(--radius-full)" />
        <Block w="50px" h="24px" mb="0" radius="var(--radius-full)" />
      </div>
    </div>
  );
}

export default function SkeletonLoader({ variant = 'talents' }) {
  if (variant === 'talents') {
    return (
      <div className="grid-talents">
        {[1,2,3,4,5,6,7,8].map(i => <TalentCardSkeleton key={i} />)}
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div>
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <Block w="320px" h="28px" mb="8px" />
          <Block w="220px" h="14px" />
        </div>
        <div className="grid-stats" style={{ marginBottom: 'var(--space-xl)' }}>
          {[1,2,3,4].map(i => <StatSkeleton key={i} />)}
        </div>
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <Block w="140px" h="16px" mb="16px" />
          {[1,2,3].map(i => <Block key={i} w="100%" h="48px" />)}
        </div>
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <Block w="100px" h="100px" mb="0" radius="50%" />
          <div style={{ flex: 1 }}>
            <Block w="200px" h="24px" mb="8px" />
            <Block w="140px" h="14px" mb="8px" />
            <div style={{ display: 'flex', gap: '6px' }}>
              <Block w="70px" h="24px" mb="0" radius="var(--radius-full)" />
              <Block w="80px" h="24px" mb="0" radius="var(--radius-full)" />
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <Block w="120px" h="16px" mb="16px" />
          <Block w="100%" h="80px" />
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="card" style={{ padding: 'var(--space-lg)' }}>
        <Block w="200px" h="20px" mb="16px" />
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <Block w="30%" h="16px" mb="0" />
            <Block w="20%" h="16px" mb="0" />
            <Block w="25%" h="16px" mb="0" />
            <Block w="15%" h="16px" mb="0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Block w="60%" h="24px" mb="16px" style={{ margin: '0 auto 16px' }} />
        <Block w="100%" h="120px" />
      </div>
    </div>
  );
}
