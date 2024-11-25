import Image from 'next/image';

const Banner = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      <Image
        src="/images/bannerFlujoCompra.png" // Asegúrate de que la ruta sea correcta
        alt="Banner de Compra"
        width={1920}
        height={1080}
        style={{
          width: '100%',
          height: 'auto',
        }}
        priority
      />
    </div>
  );
};

export default Banner;
