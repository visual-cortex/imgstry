declare module '*?worker' {
    class ViteWorker extends Worker {
        public constructor();
    }

    export default ViteWorker;
}
