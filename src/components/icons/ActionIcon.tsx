export default function ActionIcon() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        border: '1px solid #E2E4E9',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 2px rgba(228, 229, 231, 0.24)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.9 9.29922H20.1L11.1 22.7992V14.6992H4.79999L12.9 1.19922V9.29922ZM11.1 11.0992V7.69722L7.97879 12.8992H12.9V16.8538L16.7367 11.0992H11.1Z" fill="#525866" />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: '#DF1C41',
          border: '2px solid #FFFFFF',
        }}
      />
    </div>
  );
}
