declare module '*worker&inline' {
    class WebpackWorker extends Worker {
        public constructor();
    }

    export default WebpackWorker;
}
